import { describe, it, expect } from 'vitest';
import { usePagination } from './usePagination';
import type { RawProjectDetails } from '~/interfaces';

const mockProjects: Array<RawProjectDetails> = [
    {
      project: {
        title: 'Project 1',
        projectId: 1,
        md: [],
        pms: [],
        coInvestigators: [],
        leadOrganization: { organizationName: 'Org 1', organizationId: 1 },
        supportingOrganizations: [],
        principalInvestigators: [],
        directors: [],
        executives: [],
        startDateString: '2024-01-01',
        endDateString: '2024-12-31',
        statusDescription: 'Active',
        website: 'https://project1.example.com',
      },
    },
    {
        project: {
          title: 'Project 2',
          projectId: 2,
          md: [],
          pms: [],
          coInvestigators: [],
          leadOrganization: { organizationName: 'Org 2', organizationId: 2 },
          supportingOrganizations: [],
          principalInvestigators: [],
          directors: [],
          executives: [],
          startDateString: '2024-01-01',
          endDateString: '2024-12-31',
          statusDescription: 'Active',
          website: 'https://project1.example.com',
        },
      },

  ];
  
  
  describe('usePagination', () => {
    it('correctly paginates the projects list', () => {
      const currPage = 1;
      const itemsPerPage = 1;
      const paginatedProjects = usePagination(mockProjects, currPage, itemsPerPage);
  
      expect(paginatedProjects.length).toBe(1);
      expect(paginatedProjects[0].title).toBe('Project 1');
    });
  
    it('returns an empty array for null input', () => {
      const currPage = 1;
      const itemsPerPage = 1;
      const paginatedProjects = usePagination(null, currPage, itemsPerPage);
  
      expect(paginatedProjects).toEqual([]);
    });
  
    it('handles the last page correctly', () => {
      const currPage = 2;
      const itemsPerPage = 1;
      const paginatedProjects = usePagination(mockProjects, currPage, itemsPerPage);
  
      expect(paginatedProjects.length).toBe(1);
      expect(paginatedProjects[0].title).toBe('Project 2');
    });
  });
  
