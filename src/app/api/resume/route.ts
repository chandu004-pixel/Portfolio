import { NextResponse } from 'next/server';

export async function GET() {
  const resumeData = {
    name: 'Chandril Das',
    title: 'Full-Stack Engineer & Creative Technologist',
    contact: {
      email: 'hello@example.com',
      github: 'https://github.com/chandrildas',
    },
    experience: [
      {
        role: 'Senior Frontend Engineer',
        company: 'Tech Corp',
        duration: '2023 — Present',
      },
      {
        role: 'Full-Stack Developer',
        company: 'Agency X',
        duration: '2021 — 2023',
      },
    ],
    skills: [
      'React',
      'Next.js 15',
      'TypeScript',
      'Tailwind CSS',
      'Node.js',
      'MongoDB',
    ],
  };

  return NextResponse.json(resumeData, { status: 200 });
}
