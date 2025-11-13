import React from 'react';

const ProjectHeader = ({ 
  icon: Icon,          
  backgroundImage,      // For background images
  imageAlt = "Project", 
  title, 
  subtitle, 
  stats = [] 
}) => {
  return (
    <div 
      className="relative rounded-xl p-8 text-white mb-8 overflow-hidden"
      style={{
        background: backgroundImage 
          ? `url(${backgroundImage})`
          : 'linear-gradient(to right, #04445E, #169AB4)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Black overlay layer */}
      {backgroundImage && (
        <div className="absolute inset-0 bg-black/70 z-0"></div>
      )}
      
      <div className="flex items-center gap-4 mb-6 relative z-10">
        {Icon && <Icon className="h-12 w-12" />}
        
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="text-white/90">{subtitle}</p>
        </div>
      </div>
      
      {stats.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl font-bold">{stat.value}</div>
              <div className="text-white/80">{stat.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectHeader;