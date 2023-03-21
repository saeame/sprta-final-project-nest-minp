import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Req,
  Patch,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AwsService } from 'src/s3-upload/aws.service';
import { CatsService } from './cats.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';

@Controller('cats')
export class CatsController {
  constructor(
    private readonly catService: CatsService,
    private readonly awsService: AwsService
    ) {}

  // 유저 ID에 속성 된 고양이 전체 상세보기
  @Get('/')
  async getMyCat(@Req() req) {
    const data = await this.catService.getMyCat(req.userId);
    return data;
  }

  @Post('/')
  @UseInterceptors(FileInterceptor('image'))
  async createCat(
    @Req() req,
    @UploadedFile() file: Express.Multer.File,
    @Body() data: CreateCatDto) {
    const folder = 'cat_images'
    const image = await this.awsService.uploadFileToS3(folder, file)
    data.image = image;
    return this.catService.createCat(req.userId, data);
  }

  @Patch('/:id')
  @UseInterceptors(FileInterceptor('image'))
  async updateCat(
    @Req() req,
    @Param('id') catId: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() data: UpdateCatDto
  ) {
    const folder = 'cat_images'
    const image = await this.awsService.uploadFileToS3(folder, file)
    data.image = image;
    return await this.catService.updateCatById(req.userId, catId, data);
  }

  @Delete('/:id')
  deleteCat(@Req() req, @Param('id') catId: number) {
    return this.catService.deleteCatById(req.userId, catId);
  }
}
