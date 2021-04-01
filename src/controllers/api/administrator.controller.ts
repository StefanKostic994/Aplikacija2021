import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
import { Administrator } from "entities/administrator.entity";
import { AddAdministratorDto } from "src/dtos/administrator/add.administrator.dto";
import { EditAdministratorDto } from "src/dtos/administrator/edit.administrator.dto";
import { AdministratorService } from "src/services/administrator/administrator.service";

@Controller('api/administrator')
export class AdministratorController {
    constructor(
        private administrorService: AdministratorService
      ) { }

      @Get()
      getAll(): Promise<Administrator[]> {
        return this.administrorService.getAll();
      }

      @Get(':id')
      getById( @Param('id') administratorId: number): Promise<Administrator> {
        return this.administrorService.getById(administratorId);
      }

      @Put()
      add( @Body() data: AddAdministratorDto): Promise<Administrator> {
        return this.administrorService.add(data);
      }

      @Post(':id')
      edit(@Param('id') id: number, @Body() data: EditAdministratorDto): Promise<Administrator> {
        return this.administrorService.editById(id,data);
      }
    
}