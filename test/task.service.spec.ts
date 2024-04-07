import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from '../src/task/task.service';
import { PrismaService } from '../src/prisma/prisma.service';

describe('TaskService', () => {
  let service: TaskService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: PrismaService,
          useValue: {
            task: {
              create: jest.fn().mockResolvedValue(null),
              findMany: jest.fn().mockResolvedValue(null),
              findUnique: jest.fn().mockResolvedValue(null),
              update: jest.fn().mockResolvedValue(null),
              delete: jest.fn().mockResolvedValue(null),
            },
            schedule: {
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a task', async () => {
    const taskData = { name: 'Test Task', scheduleId: 1 };
    const createdTask = { id: 1, ...taskData };

    jest.spyOn(prismaService.task, 'create').mockResolvedValue(createdTask);

    const result = await service.createTask(taskData);
    expect(result.name).toEqual(taskData.name);
    expect(result.scheduleId).toEqual(taskData.scheduleId);

    expect(prismaService.task.create).toHaveBeenCalledWith({ data: taskData });
  });

  it('should retrieve all tasks', async () => {
    const tasks = [
      { id: 1, name: 'Task 1', scheduleId: 1 },
      { id: 2, name: 'Task 2', scheduleId: 2 },
    ];

    jest.spyOn(prismaService.task, 'findMany').mockResolvedValue(tasks);

    await expect(service.getTasks()).resolves.toEqual(tasks);
  });

  it('should retrieve a task by ID', async () => {
    const task = { id: 1, name: 'Task 1', scheduleId: 1 };

    jest.spyOn(prismaService.task, 'findUnique').mockResolvedValue(task);

    await expect(service.getTaskById(1)).resolves.toEqual(task);
  });

  it('should update a task name', async () => {
    const taskUpdateData = { name: 'Updated Task Name' };
    const updatedTask = { id: 1, ...taskUpdateData, scheduleId: 1 };

    jest.spyOn(prismaService.task, 'update').mockResolvedValue(updatedTask);

    await expect(service.updateTask(1, taskUpdateData)).resolves.toEqual(
      updatedTask,
    );

    expect(prismaService.task.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { name: taskUpdateData.name },
    });
  });

  it('should reassign a task to another schedule', async () => {
    const scheduleId = 2;
    const taskUpdateData = { name: 'Test Task', scheduleId };
    const updatedTask = { id: 1, ...taskUpdateData };

    jest.spyOn(prismaService.schedule, 'findUnique').mockResolvedValue({
      id: scheduleId,
      title: 'Schedule Title',
      details: 'Schedule Details',
      startTime: new Date(),
      endTime: new Date(),
    });

    jest.spyOn(prismaService.task, 'update').mockResolvedValue(updatedTask);

    await expect(service.updateTask(1, taskUpdateData)).resolves.toEqual(
      updatedTask,
    );

    expect(prismaService.task.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: {
        name: taskUpdateData.name,
        schedule: taskUpdateData.scheduleId
          ? { connect: { id: taskUpdateData.scheduleId } }
          : undefined,
      },
    });
  });

  it('should not update a task with an invalid schedule ID', async () => {
    const invalidScheduleId = 99; // Assuming this schedule does not exist
    const taskUpdateData = { scheduleId: invalidScheduleId };

    jest.spyOn(prismaService.schedule, 'findUnique').mockResolvedValue(null);

    await expect(service.updateTask(1, taskUpdateData)).rejects.toThrow(
      `Schedule with ID ${invalidScheduleId} does not exist.`,
    );

    expect(prismaService.schedule.findUnique).toHaveBeenCalledWith({
      where: { id: invalidScheduleId },
    });
  });

  it('should delete a task', async () => {
    const deletedTask = { id: 1, name: 'Deleted Task', scheduleId: 1 };

    jest.spyOn(prismaService.task, 'delete').mockResolvedValue(deletedTask);

    await expect(service.deleteTask(1)).resolves.toEqual(deletedTask);

    expect(prismaService.task.delete).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });
});
