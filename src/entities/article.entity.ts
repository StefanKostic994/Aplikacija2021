import {
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Category } from "./category.entity";
import { ArticleFeature } from "./article-features.entity";
import { ArticlePrice } from "./article-price.entity";
import { CartArticle } from "./cart-article.entity";
import { Photo } from "./photo.entity";
import { type } from "node:os";
import { Feature } from "./feature.entity";
import { features } from "node:process";
import * as Validator from 'class-validator';
import { ArticleStatus } from "src/types/article.status";

@Index("fk_article_category_id", ["categoryId"], {})
@Entity("article")
export class Article {
  @PrimaryGeneratedColumn({ type: "int", name: "article_id", unsigned: true })
  articleId: number;

  @Column( {type:"varchar", name: "name", length: 128})
  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.Length(5,128)
  name: string;

  @Column( {type:"int", name: "category_id", unsigned: true})
  categoryId: number;

  @Column( {type:"varchar", name: "except", length: 255})
  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.Length(10,255)
  except: string;

  @Column( {type:"text", name: "description" })
  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.Length(64,10000)
  description: string;

  @Column( {
    type:"enum",
    name: "status",
    enum: ["available", "visible", "hidden"],
    default: () => "'available'"
  })
  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.IsIn(["available" , "visible" , "hidden"])
  //@Validator.IsEnum(ArticleStatus)
  status: "available" | "visible" | "hidden";

  @Column( {
    type:"tinyint",
    name: "is_promoted",
    unsigned: true
  })
  @Validator.IsNotEmpty()
  @Validator.IsIn([0,1])
  isPromoted: number;

  @Column( {
    type:"timestamp",
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @ManyToOne(
    () => Category, 
    (category) => category.articles, {
    onDelete: "NO ACTION",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "category_id", referencedColumnName: "categoryId" }])
  category: Category;

  @OneToMany(() => ArticleFeature, (articleFeature) => articleFeature.article)
  articleFeatures: ArticleFeature[];

  @ManyToMany(type => Feature, feature => feature.articles)
  @JoinTable({
    name: 'article_feature',
    joinColumn: {name: 'article_id', referencedColumnName: 'articleId'},
    inverseJoinColumn: {name: 'feature_id', referencedColumnName: 'featureId'}
  })
  features: Feature[];

  @OneToMany(() => ArticlePrice, (articlePrice) => articlePrice.article)
  articlePrices: ArticlePrice[];

  @OneToMany(() => CartArticle, (cartArticle) => cartArticle.article)
  cartArticles: CartArticle[];

  @OneToMany(() => Photo, (photo) => photo.article)
  photos: Photo[];
}
