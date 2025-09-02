import React from 'react';
import windmill from '../../assets/windmill.svg';

const ProjectCard = ({ project }) => {
  return (

    <div className={`relative rounded-2xl shadow-lg p-8 overflow-hidden ${project.customContainerClass}`}>
      
      {project.Icon && (
        <div className="absolute inset-0 flex items-center justify-end text-white/10 -right-10">
          <project.Icon size={300} />
        </div>
      )}

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <span className="bg-s2 text-m-s2 font-bold text-xs px-3 py-1 rounded-full">{project.status}</span>
          <a href="#" className="text-sm font-semibold underline">View Map</a>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 items-start">
          <div className="md:col-span-2">
            <h3 className="text-3xl font-bold mb-2">{project.title}</h3>
            <p className="text-sm leading-relaxed mb-4">{project.description}</p>
            <div className={`text-sm p-4 rounded-lg ${project.partnerBgClass}`}>
              <p className="font-bold">Partners</p>
              <p>{project.partners}</p>
            </div>
          </div>
          <div className="hidden md:flex items-center justify-center pt-4">
              <img 
                  src={windmill} 
                  alt="Wind turbine icon" 
                  className="w-24 h-24 object-contain opacity-70"
              />
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <button className={`font-bold py-3 px-6 rounded-lg transition-colors duration-300 w-full ${project.buttonPrimaryClass}`}>
              Read More
          </button>
          <button className={`font-bold py-3 px-6 rounded-lg transition-colors duration-300 w-full ${project.buttonSecondaryClass}`}>
              Get Involved
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;