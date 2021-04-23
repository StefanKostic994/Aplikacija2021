import * as Validator from 'class-validator'; 
import { ArticleFeatureComponentDto } from './article.features.component.dto';

export class AddArticleDto {

    @Validator.IsNotEmpty()
    @Validator.IsString()
    @Validator.Length(5,128)
    name: string;

    categoryId: number;

    @Validator.IsNotEmpty()
    @Validator.IsString()
    @Validator.Length(10,255)
    excerpt: string;

    @Validator.IsNotEmpty()
    @Validator.IsString()
    @Validator.Length(64,10000)
    description: string;

    @Validator.IsNotEmpty()
    @Validator.IsPositive()
    @Validator.IsNumber({
    allowInfinity: false,
    allowNaN: false,
    maxDecimalPlaces: 2,
  })
    price: number;

    @Validator.IsArray()
    @Validator.ValidateNested({
        always: true
    })
    features: ArticleFeatureComponentDto[];
}

/*
{
    "name": "ACME SDD HD11 1TB",
    "categoryId": 5,
    "excerpt": "Kratak opis proizvoda",
    description: "Detaljan opis proizvoda",
    "price": 56.78,
    features: [
        { "featureId": 1, value: "1TB"},
        { "featureId": 2, value: "SSD"}
    ]
}

*/ 