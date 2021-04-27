import { Body, Controller, Get, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { Cart } from "src/entities/cart.entity";
import { AllowToRoles } from "src/misc/allow.to.roles.descriptor";
import { RoleCheckerGuard } from "src/misc/role.checker.guard";
import { CartService } from "src/services/cart/cart.service";
import { Request } from "express";
import { AddArticleToCartDto } from "src/dtos/cart/add.article.to.cart.dto";
import { ApiResponse } from "src/misc/api.response.class";
import { EditArticleInCartDto } from "src/dtos/cart/edit.article.in.cart.dto";
import { Order } from "src/entities/order.entity";
import { OrderService } from "src/services/order/order.service";
import { OrderMailer } from "src/services/order/order.mailer.service";

@Controller('api/user/cart')
export class UserCartController {
    constructor(
        private cartService: CartService,
        private orderSerice: OrderService,
        private ordeerMailer: OrderMailer
      ) { }

      private async getActiveCartByUserId(userId: number): Promise<Cart> {
        let cart = await this.cartService.getLastActiveCartByUserId(userId);

        if(!cart) {
            cart = await this.cartService.createNewCartForUser(userId);
        }
        return this.cartService.getById(cart.cartId);
      }

      @Get()
      @UseGuards(RoleCheckerGuard)
      @AllowToRoles("user")
      async getCurrentCart(@Req() req: Request): Promise<Cart | ApiResponse> {
            return await this.getActiveCartByUserId(req.token.id);
      }

      @Post('addToCart')
      @UseGuards(RoleCheckerGuard)
      @AllowToRoles("user")
      async addToCart(@Body() data: AddArticleToCartDto, @Req() req: Request): Promise<Cart> {
            const cart = await this.getActiveCartByUserId(req.token.id);
            return await this.cartService.addArticleToCart(cart.cartId,data.articleId,data.quantity);
      }

      //PATCH
      @Patch()
      @UseGuards(RoleCheckerGuard)
      @AllowToRoles("user")
      async changeQuantity(@Body() data: EditArticleInCartDto, @Req() req: Request): Promise<Cart> {
             const cart = await this.getActiveCartByUserId(req.token.id);
             return await this.cartService.changeQuatity(cart.cartId, data.articleId, data.quantity);
      }

      @Post('makeOrder')
      @UseGuards(RoleCheckerGuard)
      @AllowToRoles("user")
      async makeOrder(@Req() req: Request): Promise<Order | ApiResponse> {
            const cart = await this.getActiveCartByUserId(req.token.id);
            const order = await this.orderSerice.add(cart.cartId);

            if(order instanceof ApiResponse) {
                  return order;
            }

            await this.ordeerMailer.sendOrderEmail(order);

            return order;
      }

}