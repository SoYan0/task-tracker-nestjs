import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {
  constructor(@InjectRepository(Task) private taskRepo: Repository<Task>) {}

  async create(userId: number, dto: CreateTaskDto) {
    const task = this.taskRepo.create({ ...dto, user: { id: userId } });
    return this.taskRepo.save(task);
  }

  async findAll(userId: number) {
    return this.taskRepo.find({ where: { user: { id: userId } } });
  }

  async findOne(userId: number, id: number) {
    const task = await this.taskRepo.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!task || task.user.id !== userId) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  async update(userId: number, id: number, dto: UpdateTaskDto) {
    const task = await this.findOne(userId, id);
    Object.assign(task, dto);
    return this.taskRepo.save(task);
  }

  async remove(userId: number, id: number) {
    const task = await this.findOne(userId, id);
    return this.taskRepo.remove(task);
  }
}
