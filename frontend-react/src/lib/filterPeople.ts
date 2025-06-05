import type { Person, PersonRole, Department } from '../lib/types';

export function filterPeople(
  people: Person[],
  searchQuery: string,
  selectedRole: PersonRole | 'All',
  selectedDepartment: Department | 'All'
): Person[] {
  return people.filter(person => {
    const matchesRole = selectedRole === 'All' || person.role === selectedRole;
    const matchesDepartment = selectedDepartment === 'All' || person.department === selectedDepartment;
    const matchesSearch = person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      person.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (person.expertise && person.expertise.some((exp: string) => exp.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesRole && matchesDepartment && matchesSearch;
  });
}
