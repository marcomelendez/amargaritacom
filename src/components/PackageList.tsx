import React from 'react';
import type { Package } from '@/types';
import PackageCard from './PackageCard';

interface PackageListProps {
  packages: Package[];
  loading: boolean;
}

const PackageList: React.FC<PackageListProps> = ({ packages, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B00]"></div>
      </div>
    );
  }

  if (packages.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-8">
      {packages.map((pkg) => (
        <PackageCard key={pkg.id} pkg={pkg} />
      ))}
    </div>
  );
};

export default PackageList;
