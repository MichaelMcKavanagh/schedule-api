// Import the PrismaService
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async createTask(data: Prisma.TaskCreateInput) {
    return this.prisma.task.create({
      data,
    });
  }

  async getTasks() {
    return this.prisma.task.findMany();
  }

  async getTaskById(id: number) {
    return this.prisma.task.findUnique({
      where: { id },
    });
  }

  async updateTask(
    id: number,
    data: { name?: string; scheduleId?: number | null },
  ) {
    if (data.scheduleId !== undefined && data.scheduleId !== null) {
      const scheduleExists = await this.prisma.schedule.findUnique({
        where: { id: data.scheduleId },
      });
      if (!scheduleExists) {
        throw new Error(`Schedule with ID ${data.scheduleId} does not exist.`);
      }
    }

    const updateData: Prisma.TaskUpdateInput = {
      name: data.name,
      ...(data.scheduleId !== undefined && {
        schedule:
          data.scheduleId === null
            ? { disconnect: true }
            : { connect: { id: data.scheduleId } },
      }),
    };

    return this.prisma.task.update({
      where: { id },
      data: updateData,
    });
  }

  async deleteTask(id: number) {
    return this.prisma.task.delete({
      where: { id },
    });
  }
}
