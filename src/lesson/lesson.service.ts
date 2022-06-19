import { CreateLessonInput } from './lesson.input';
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

  async getLessons(): Promise<Lesson[]> {
    try {
      return await this.lessonRepository.find();
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async createLesson(createLessonInput: CreateLessonInput): Promise<Lesson> {
    const { name, startDate, endDate } = createLessonInput;
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
