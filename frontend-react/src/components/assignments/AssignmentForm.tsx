import { useState } from 'react';
import type { Assignment } from '@/types/scheduling';

interface AssignmentFormProps {
  onSubmit: (assignment: Omit<Assignment, 'id' | 'submissionCount' | 'status'>) => void;
  onCancel: () => void;
}

export default function AssignmentForm({ onSubmit, onCancel }: AssignmentFormProps) {
  const [title, setTitle] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [courseTitle, setCourseTitle] = useState('');
  const [batch, setBatch] = useState('');
  const [semester, setSemester] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [totalMarks, setTotalMarks] = useState(0);
  const [createdBy, setCreatedBy] = useState('');

  // Predefined semester and batch options
  const semesterOptions = ['1', '2', '3', '4', '5', '6', '7', '8'];
  const batchOptions = ['27', '28', '29', '30', '31'];
  const courseOptions = [
    { code: 'CSE101', title: 'Introduction to Computer Science' },
    { code: 'CSE201', title: 'Data Structures' },
    { code: 'CSE301', title: 'Database Systems' },
    { code: 'CSE401', title: 'Artificial Intelligence' },
    { code: 'CSE501', title: 'Machine Learning' },
    { code: 'CSE601', title: 'Computer Networks' },
    { code: 'CSE701', title: 'Advanced Algorithms' },
    { code: 'CSE801', title: 'Thesis' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSubmit({
      title,
      courseCode,
      courseTitle,
      batch,
      semester,
      description,
      deadline,
      totalMarks,
      createdBy
    });
  };

  const handleCourseChange = (code: string) => {
    setCourseCode(code);
    const course = courseOptions.find(c => c.code === code);
    if (course) {
      setCourseTitle(course.title);
    }
  };

  return (
    <div className="bg-card p-6 rounded-lg shadow-sm">
      <h3 className="mb-4 font-medium">Create New Assignment</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="title" className="block mb-2 text-sm text-muted-foreground">
              Assignment Title
            </label>
            <input
              id="title"
              type="text"
              className="w-full p-2 border rounded-md bg-background"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label htmlFor="course" className="block mb-2 text-sm text-muted-foreground">
              Course
            </label>
            <select
              id="course"
              className="w-full p-2 border rounded-md bg-background"
              value={courseCode}
              onChange={(e) => handleCourseChange(e.target.value)}
              required
            >
              <option value="">Select Course</option>
              {courseOptions.map((course) => (
                <option key={course.code} value={course.code}>
                  {course.code} - {course.title}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="batch" className="block mb-2 text-sm text-muted-foreground">
              Batch
            </label>
            <select
              id="batch"
              className="w-full p-2 border rounded-md bg-background"
              value={batch}
              onChange={(e) => setBatch(e.target.value)}
              required
            >
              <option value="">Select Batch</option>
              {batchOptions.map((b) => (
                <option key={b} value={b}>
                  Batch {b}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="semester" className="block mb-2 text-sm text-muted-foreground">
              Semester
            </label>
            <select
              id="semester"
              className="w-full p-2 border rounded-md bg-background"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              required
            >
              <option value="">Select Semester</option>
              {semesterOptions.map((sem) => (
                <option key={sem} value={sem}>
                  Semester {sem}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="deadline" className="block mb-2 text-sm text-muted-foreground">
              Deadline
            </label>
            <input
              id="deadline"
              type="datetime-local"
              className="w-full p-2 border rounded-md bg-background"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label htmlFor="totalMarks" className="block mb-2 text-sm text-muted-foreground">
              Total Marks
            </label>
            <input
              id="totalMarks"
              type="number"
              min="0"
              className="w-full p-2 border rounded-md bg-background"
              value={totalMarks || ''}
              onChange={(e) => setTotalMarks(parseInt(e.target.value) || 0)}
              required
            />
          </div>
          
          <div>
            <label htmlFor="createdBy" className="block mb-2 text-sm text-muted-foreground">
              Created By
            </label>
            <input
              id="createdBy"
              type="text"
              className="w-full p-2 border rounded-md bg-background"
              value={createdBy}
              onChange={(e) => setCreatedBy(e.target.value)}
              required
            />
          </div>
        </div>
        
        <div className="mb-4">
          <label htmlFor="description" className="block mb-2 text-sm text-muted-foreground">
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            className="w-full p-2 border rounded-md bg-background"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            className="px-4 py-2 border border-muted rounded-md hover:bg-muted"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            Create Assignment
          </button>
        </div>
      </form>
    </div>
  );
}
