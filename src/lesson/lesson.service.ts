import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lesson } from './lesson.entity';
import { v4 as uuid } from 'uuid';

@Injectable()
export class LessonService {
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
  ) {}

  async getLesson(id: string): Promise<Lesson> {
    try {
      return await this.lessonRepository.findOne({ where: { id } });
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async createLesson(name, startDate, endDate): Promise<Lesson> {
    try {
      const lesson = this.lessonRepository.create({
        id: uuid(),
        name,
        startDate,
        endDate,
      });
      return await this.lessonRepository.save(lesson);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
