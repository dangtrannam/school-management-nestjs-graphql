import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './student.entity';
import { v4 as uuid } from 'uuid';
import { CreateStudentInput } from './create-student.input';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
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
}
