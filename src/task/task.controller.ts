import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { Prisma } from '@prisma/client';
import { TaskUpdateDTO } from './task-update.dto';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  createTask(@Body() data: Prisma.TaskCreateInput) {
    return this.taskService.createTask(data);
  }

  @Get()
  getTasks() {
    return this.taskService.getTasks();
  }

  @Get(':id')
  getTaskById(@Param('id') id: string) {
    return this.taskService.getTaskById(+id);
  }

  @Put(':id')
  updateTask(@Param('id') id: string, @Body() data: TaskUpdateDTO) {
    return this.taskService.updateTask(+id, data);
  }

  @Delete(':id')
  deleteTask(@Param('id') id: string) {
    return this.taskService.deleteTask(+id);
  }
}
