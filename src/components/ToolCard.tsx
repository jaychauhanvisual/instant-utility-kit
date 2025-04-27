
import { FC } from 'react';
import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

export type ToolCategory = 'pdf' | 'image' | 'calculator' | 'text' | 'other';

interface ToolCardProps {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  category: ToolCategory;
  comingSoon?: boolean;
}

const ToolCard: FC<ToolCardProps> = ({ id, title, description, icon: Icon, category, comingSoon = false }) => {
  return (
    <Link 
      to={comingSoon ? '#' : `/${category}/${id}`}
      className={`tool-card ${category} group ${comingSoon ? 'opacity-70 cursor-not-allowed' : 'hover:translate-y-[-4px]'}`}
      onClick={(e) => comingSoon && e.preventDefault()}
    >
      <div className={`w-12 h-12 mb-4 rounded-lg flex items-center justify-center bg-utility-${category}/10 text-utility-${category} group-hover:animate-float`}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-sm text-center text-muted-foreground">{description}</p>
      
      {comingSoon && (
        <div className="absolute top-3 right-3 bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full">
          Coming Soon
        </div>
      )}
    </Link>
  );
};

export default ToolCard;
