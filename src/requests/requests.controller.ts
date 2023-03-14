import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { UserInfo } from 'src/users/user.info.decorator';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { RequestsService } from './requests.service';

@Controller('requests')
export class RequestsController {
  constructor(private readonly requestService: RequestsService) {}

  @Get()
  async getRequests() {
    return await this.requestService.getRequests();
  }

  @Get('/:id')
  async getRequestById(@Param('id') requestId: number) {
    return await this.requestService.getRequestById(requestId);
  }

  @Post()
  createRequest(
    @UserInfo() user,
    @Req() req: Request,
    @Body() data: CreateRequestDto
  ) {
    // FIXME: const userEmail = req.user;
    const userId = user.user_id;
    return this.requestService.createRequest(userId, data);
  }

  @Patch('/:id')
  updateRequestById(
    @Req() req,
    @Param('id') requestId: number,
    @Body() data: UpdateRequestDto
  ) {
    // TODO:
    // if (data.detail && data.detail === '') {
    //   throw new BadRequestException(
    //     "When 'detail' is given, it should not be an empty string."
    //   );
    // }
    this.requestService.updateRequestById(req.user, requestId, data);
  }

  @Delete('/:id')
  deleteRequestById(@Req() req, @Param('id') requestId: number) {
    this.requestService.deleteRequestById(req.user, requestId);
  }
}
