import { Body, Controller, Get, Param, Post, Put, SetMetadata, UseGuards } from "@nestjs/common";
import { Administrator } from "src/entities/administrator.entity";
import { AddAdministratorDto } from "src/dtos/administrator/add.administrator.dto";
import { EditAdministratorDto } from "src/dtos/administrator/edit.administrator.dto";
import { ApiResponse } from "src/misc/api.response.class";
import { AdministratorService } from "src/services/administrator/administrator.service";
import { AllowToRoles } from "src/misc/allow.to.roles.descriptor";
import { RoleCheckerGuard } from "src/misc/role.checker.guard";

@Controller('api/administrator')
export class AdministratorController {
    constructor(
        private administrorService: AdministratorService
      ) { }

      @Get()
      //@SetMetadata('allow_to_role', ['administrator'])
      @UseGuards(RoleCheckerGuard)
      @AllowToRoles("administrator")
      getAll(): Promise<Administrator[]> {
        return this.administrorService.getAll();
      }

      @Get(':id')
      @UseGuards(RoleCheckerGuard)
      @AllowToRoles("administrator")
      getById( @Param('id') administratorId: number): Promise<Administrator | ApiResponse> {
          return new Promise(async (resolve) => {
              let admin = await this.administrorService.getById(administratorId);
              if(admin === undefined){
                  resolve(new ApiResponse('error',-1002));
              }
              resolve(admin);
          })
      }

      @Put()
      @UseGuards(RoleCheckerGuard)
      @AllowToRoles("administrator")
      add( @Body() data: AddAdministratorDto): Promise<Administrator | ApiResponse> {
        return this.administrorService.add(data);
      }

      @Post(':id')
      @UseGuards(RoleCheckerGuard)
      @AllowToRoles("administrator")
      edit(@Param('id') id: number, @Body() data: EditAdministratorDto): Promise<Administrator | ApiResponse> {
        return this.administrorService.editById(id,data);
      }
    
}