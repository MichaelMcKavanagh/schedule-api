import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleService } from '../src/schedule/schedule.service';
import { PrismaService } from '../src/prisma/prisma.service';

describe('ScheduleService', () => {
  let service: ScheduleService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScheduleService,
        {
          provide: PrismaService,
          useValue: {
            schedule: {
              create: jest.fn().mockImplementation((data) =>
                Promise.resolve({
                  id: 1,
                  ...data.data,
                }),
              ),
              findMany: jest.fn().mockResolvedValue([]),
              findUnique: jest.fn().mockResolvedValue(null),
              update: jest.fn().mockResolvedValue(null),
              delete: jest.fn().mockResolvedValue(null),
            },
            task: {
              findMany: jest.fn().mockResolvedValue([]), // Default
            },
          },
        },
      ],
    }).compile();

    service = module.get<ScheduleService>(ScheduleService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a schedule', async () => {
    const fixedDate = new Date('2024-01-01T00:00:00.000Z');
    const scheduleData = {
      title: 'Test Schedule',
      details: 'Details',
      startTime: fixedDate,
      endTime: fixedDate,
    };

    jest.spyOn(prismaService.schedule, 'create').mockResolvedValue({
      id: 1,
      ...scheduleData,
    });

    await expect(service.createSchedule(scheduleData)).resolves.toEqual({
      id: 1,
      ...scheduleData,
    });

    expect(prismaService.schedule.create).toHaveBeenCalledWith({
      data: scheduleData,
    });
  });

  it('should retrieve all schedules', async () => {
    const schedules = [
      {
        id: 1,
        title: 'Schedule 1',
        details: 'Details 1',
        startTime: new Date(),
        endTime: new Date(),
      },
      {
        id: 2,
        title: 'Schedule 2',
        details: 'Details 2',
        startTime: new Date(),
        endTime: new Date(),
      },
    ];

    jest.spyOn(prismaService.schedule, 'findMany').mockResolvedValue(schedules);

    await expect(service.getSchedules()).resolves.toEqual(schedules);
  });

  it('should retrieve a schedule by ID', async () => {
    const schedule = {
      id: 1,
      title: 'Schedule 1',
      details: 'Details',
      startTime: new Date(),
      endTime: new Date(),
    };

    jest
      .spyOn(prismaService.schedule, 'findUnique')
      .mockResolvedValue(schedule);

    await expect(service.getScheduleById(1)).resolves.toEqual(schedule);
  });

  it('should update schedule', async () => {
    const scheduleUpdateData = {
      title: 'Updated Title',
      details: 'Updated Details',
    };
    const updatedSchedule = {
      id: 1,
      ...scheduleUpdateData,
      startTime: new Date(),
      endTime: new Date(),
    };

    jest
      .spyOn(prismaService.schedule, 'update')
      .mockResolvedValue(updatedSchedule);

    await expect(
      service.updateSchedule(1, scheduleUpdateData),
    ).resolves.toEqual(updatedSchedule);
  });

  it('should update schedule with associated task', async () => {
    const scheduleUpdateData = {
      title: 'Updated Title',
      details: 'Updated Details',
    };
    const associatedTask = {
      id: 2,
      name: 'Task 1',
      scheduleId: 1,
    };

    const updatedSchedule = {
      id: 1,
      ...scheduleUpdateData,
      startTime: new Date(),
      endTime: new Date(),
      tasks: [associatedTask], // simulate associated task
    };

    jest
      .spyOn(prismaService.schedule, 'update')
      .mockResolvedValue(updatedSchedule);

    await expect(
      service.updateSchedule(1, scheduleUpdateData),
    ).resolves.toEqual(updatedSchedule);

    expect(prismaService.schedule.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: scheduleUpdateData,
      include: { tasks: true },
    });
  });

  it('should delete a schedule without tasks', async () => {
    const deletedSchedule = {
      id: 1,
      title: 'Deleted Schedule',
      details: 'Details',
      startTime: new Date(),
      endTime: new Date(),
    };

    jest.spyOn(prismaService.task, 'findMany').mockResolvedValue([]);
    jest
      .spyOn(prismaService.schedule, 'delete')
      .mockResolvedValue(deletedSchedule);

    await expect(service.deleteSchedule(1)).resolves.toEqual(deletedSchedule);
  });

  it('should not delete a schedule with tasks', async () => {
    const associatedTasks = [
      {
        id: 1,
        name: 'Task 1',
        scheduleId: 1,
      },
    ];

    jest
      .spyOn(prismaService.task, 'findMany')
      .mockResolvedValue(associatedTasks);

    await expect(service.deleteSchedule(1)).rejects.toThrow(
      'Schedule cannot be deleted as it has associated tasks. Please delete the tasks first.',
    );
  });
});
