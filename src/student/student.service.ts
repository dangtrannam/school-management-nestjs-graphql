import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { CreateStudentInput } from './create-student.input';
import { Student } from './student.entity';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: MongoRepository<Student>,
  ) {}

  async getStudent(id: string): Promise<Student> {
    try {
      return await this.studentRepository.findOne({ where: { id } });
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getStudents(): Promise<Student[]> {
    try {
      return await this.studentRepository.find();
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async createStudent(
    createStudentInput: CreateStudentInput,
  ): Promise<Student> {
    const { firstName, lastName } = createStudentInput;
    try {
      const student = this.studentRepository.create({
        id: uuid(),
        firstName,
        lastName,
      });
      return await this.studentRepository.save(student);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getManyStudents(studentIds: string[]): Promise<Student[]> {
    try {
      if (typeof studentIds !== 'object' || studentIds.length < 1) {
        return [];
      }
      const students = await this.studentRepository.findBy({
        where: { id: { $in: [...studentIds] } },
      });
      console.log(students);

      return students;
    } catch (error) {
      console.log(error);

      throw new InternalServerErrorException();
    }
  }
}
