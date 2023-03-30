import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Types } from 'mongoose';
import { CreateCallDto, ModifyCallDto, TakeCallDto } from './call.dto';
import { Call } from './call.schema';
import { CallService } from './call.service';

@Controller('call')
@UseGuards(AuthGuard())
export class CallController {
  constructor(private callService: CallService) {}

  /**
   * 콜 생성 - Store
   * @param createCallDto
   * @returns
   */
  @Post('/create')
  createCall(@Body() createCallDto: CreateCallDto): Promise<Call> {
    return this.callService.createCall(createCallDto);
  }

  /**
   * 생성한 콜 리스트 받아오기 - Store
   * @param storeObjectId
   * @returns
   */
  @Get('/store/:id')
  getCallsByStore(
    @Param('id') storeObjectId: Types.ObjectId,
    @Query('limit') limit: string,
    @Query('page') page: string,
  ): Promise<Call[]> {
    return this.callService.getCallsByStore(storeObjectId, limit, page);
  }

  /**
   * 생성한 콜 수정 - Store
   * @param id
   * @param modifyCallDto
   * @returns
   */
  @Patch('/update/store/:id')
  updateCallByStore(
    @Param('id') id: Types.ObjectId,
    @Body() modifyCallDto: ModifyCallDto,
  ): Promise<Call> {
    return this.callService.updateCallByStore(id, modifyCallDto);
  }

  /**
   * 콜 삭제 - Store
   * @param id
   * @returns
   */
  @Delete('/delete/:id')
  deleteCall(@Param('id') id: Types.ObjectId): Promise<void> {
    return this.callService.deleteCall(id);
  }

  /**
   * 지역별 콜 리스트 받아오기 - Worker
   * @param region
   * @returns
   */
  @Get('/region/:id')
  getCallByRegion(@Param('id') region: string): Promise<Call[]> {
    return this.callService.getCallByRegion(region);
  }

  /**
   * 콜 받기 - Worker
   * @param id
   * @param takeCallDto
   * @returns
   */
  @Patch('/take/:id')
  takeCall(
    @Param('id') id: Types.ObjectId,
    @Body() takeCallDto: TakeCallDto,
  ): Promise<Call> {
    return this.callService.takeCall(id, takeCallDto);
  }

  /**
   * 콜 취소 - Worker
   * @param id
   * @param takeCallDto
   * @returns
   */
  @Patch('/cancel/:id')
  cancelCall(
    @Param('id') id: Types.ObjectId,
    @Body() takeCallDto: TakeCallDto,
  ): Promise<Call> {
    return this.callService.cancelCall(id, takeCallDto);
  }
}
