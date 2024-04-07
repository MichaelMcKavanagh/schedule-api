import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { Schedule } from '@prisma/client';

@Controller('schedules')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post()
  createSchedule(@Body() data: Schedule) {
    return this.scheduleService.createSchedule(data);
  }

  @Get()
  getSchedules() {
    return this.scheduleService.getSchedules();
  }

  @Get(':id')
  getScheduleById(@Param('id') id: string) {
    return this.scheduleService.getScheduleById(+id);
  }

  @Put(':id')
  updateSchedule(@Param('id') id: string, @Body() data: Schedule) {
    return this.scheduleService.updateSchedule(+id, data);
  }

  @Delete(':id')
  deleteSchedule(@Param('id') id: string) {
    return this.scheduleService.deleteSchedule(+id);
  }
}
