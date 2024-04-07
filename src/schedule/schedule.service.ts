import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ScheduleService {
  constructor(private prisma: PrismaService) {} // Inject PrismaService

  // Create a new schedule
  async createSchedule(data: Prisma.ScheduleCreateInput) {
    return this.prisma.schedule.create({
      data,
    });
  }

  // Retrieve all schedules
  async getSchedules() {
    return this.prisma.schedule.findMany();
  }

  // Retrieve a specific schedule by ID
  async getScheduleById(id: number) {
    return this.prisma.schedule.findUnique({
      where: { id },
      include: {
        tasks: true,
      },
    });
  }

  // Update a specific schedule by ID
  async updateSchedule(id: number, data: Prisma.ScheduleUpdateInput) {
    return this.prisma.schedule.update({
      where: { id },
      data,
      include: { tasks: true },
    });
  }

  // Delete a specific schedule by ID
  async deleteSchedule(id: number) {
    const associatedTasks = await this.prisma.task.findMany({
      where: { scheduleId: id },
    });

    if (associatedTasks.length > 0) {
      throw new Error(
        'Schedule cannot be deleted as it has associated tasks. Please delete the tasks first.',
      );
    }

    return this.prisma.schedule.delete({
      where: { id },
    });
  }
}
