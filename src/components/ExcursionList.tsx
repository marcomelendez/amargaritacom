import React from 'react';
import type { Excursion } from '@/types';
import ExcursionCard from './ExcursionCard';

interface ExcursionListProps {
  excursions: Excursion[];
  loading: boolean;
}

const ExcursionList: React.FC<ExcursionListProps> = ({ excursions, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B00]"></div>
      </div>
    );
  }

  if (!excursions || excursions.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-8">
      {excursions.map((exc) => (
        <ExcursionCard key={exc.id} excursion={exc} />
      ))}
    </div>
  );
};

export default ExcursionList;
