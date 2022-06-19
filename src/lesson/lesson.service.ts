import { CreateLessonInput } from './lesson.input';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lesson } from './lesson.entity';
import { v4 as uuid } from 'uuid';
import { AssignStudentsToLessonInput } from './assign-students-to-lesson.input';

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
    const { name, startDate, endDate, students } = createLessonInput;
    try {
      const lesson = this.lessonRepository.create({
        id: uuid(),
        name,
        startDate,
        endDate,
        students,
      });
      return await this.lessonRepository.save(lesson);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async assignStudentToLesson(
    assignStudentsToLessonInput: AssignStudentsToLessonInput,
  ): Promise<Lesson> {
    const { lessonId, studentIds } = assignStudentsToLessonInput;
    try {
      const lesson = await this.lessonRepository.findOne({
        where: { id: lessonId },
      });
      //combine the arrays with duplicates included
      const studentsWithDuplicates = [...lesson.students, ...studentIds];

      //convert it to a set which will remove duplicates
      //AND destructure back into an array
      const students = [...new Set(studentsWithDuplicates)];

      //assign the destructured set back to the lesson entity
      lesson.students = students;
      return await this.lessonRepository.save(lesson);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
