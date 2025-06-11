import React from 'react';

const ProjectsSection = () => {
    const projects = [
        {
            id: 1,
            title: "Project: 'The Sims 4'",
            description: "Worked as Gameplay Engineer for new pack development associated with Electronic Arts (EA). Used skills in Python and C++.",
            tech: ["Python", "C++"],
            link: "https://www.ea.com/en/games/the-sims/the-sims-4"
        },
        {
            id: 2,
            title: "Project: 'Rennsport'",
            description: "Worked on Rennsport.gg, a racing game using Unreal Engine, Python, and C++.",
            tech: ["Unreal Engine", "Python", "C++"],
            link: "https://www.rennsport.gg/"
        },
        {
            id: 3,
            title: "Project: 'Driving Simulation Software'",
            description: "Developed simulation software at Hyundai Mobis Technical Center of India used to generate training data for deep learning models in autonomous driving.",
            tech: ["Simulation Software", "Deep Learning Training Data"],
            link: "https://www.mobis.com/en/index.do"
        },
        {
            id: 4,
            title: "Project: 'Grant's Interest Rate Observer (Android)'",
            description: "Developed an independent financial markets journal Android app.",
            tech: ["Android"],
            link: "https://play.google.com/store/apps/details?id=com.grantspub.android"
        },
        {
            id: 6,
            title: "Project: 'Adaptamed EMR (iOS)'",
            description: "Developed modules of a fully integrated healthcare solution using Objective-C in XCode, including PMS, EMR, billing, and document management.",
            tech: ["Objective-C", "XCode", "iOS"],
            link: "https://apps.apple.com/us/developer/adaptamed/id1293646950"
        },
        {
            id: 7,
            title: "Project: 'Pro Kid (Android)'",
            description: "Designed and developed a programming puzzle game for kids in Unity3D and scripted in C# to teach programming basics.",
            tech: ["Unity3D", "C#"],
            link: "https://apkpure.com/pro-kid/com.fystems.ProKid"
        },
        {
            id: 8,
            title: "Project: 'Zombie City (Android)'",
            description: "Designed and developed a game in Unity3D scripted in JavaScript.",
            tech: ["Unity3D", "JavaScript"],
            link: "https://apkpure.com/zombie-city/com.greenapps36.ZombieCity"
        },
        {
            id: 9,
            title: "Project: 'Eleven Men's Morris (Android)'",
            description: "Developed a strategy board game in Unity3D with game logic scripted in C#.",
            tech: ["Unity3D", "C#"],
            link: "https://apkpure.com/eleven-men-s-morris/com.fystems.daadi2d"
        },
        {
            id: 10,
            title: "Project: 'The Haunting (Android)'",
            description: "Designed and developed runner game where player goes through graveyard evading lifeless.",
            tech: ["Android, Unity3D", "C#"],
            link: "https://apkpure.com/the-haunting/com.greenapps.thehauntingfree"
        },
        {
            id: 11,
            title: "Project: 'Crysis 2' (Electronic Arts)",
            description: "Performed game testing, bug reporting, and retesting for PC and Xbox360 versions.",
            tech: ["Game Testing", "Bug Reporting"],
            link: "https://www.ea.com/games/crysis/crysis-2"
        },
        {
            id: 12,
            title: "Project: 'Bulletstorm' (Electronic Arts)",
            description: "Conducted functionality, regression, soak, and multiplayer testing on PC and Xbox versions, including bug reporting.",
            tech: ["Game Testing", "Bug Reporting"],
            link: "https://bulletstorm.com/"
        },
        {
            id: 13,
            title: "Project: 'Development of Better Circuit Simulators through Topological Network Analysis'",
            description: "Bachelors Project: Developed algorithms to improve circuit simulators by transforming network topologies to optimize computational complexity and generality, outperforming conventional methods.",
            tech: ["Circuit Simulation", "Algorithm Development", "Network Analysis"],
            link: "https://www.nitw.ac.in/"
        }
    ];

    return (
        <section
            id="projects"
            className="my-8 sm:my-10 md:my-12 p-4 sm:p-6 md:p-8 bg-black bg-opacity-70 rounded-lg shadow-lg border border-green-700 mx-2 sm:mx-4 md:mx-8"
        >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-shadow-green">
                Simulation Case Files (Projects)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project) => (
                    <div
                        key={project.id}
                        className="bg-gray-900 p-6 rounded-lg border border-green-800 shadow-md transform transition duration-300 hover:scale-[1.02]"
                    >
                        <h3 className="text-2xl font-semibold mb-3 text-green-400">{project.title}</h3>
                        <p
                            className="mb-4 leading-relaxed text-gray-300"
                            dangerouslySetInnerHTML={{ __html: project.description }}
                        ></p>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {project.tech.map((tech, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 bg-green-900 text-green-300 text-xs rounded-full border border-green-700"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                        <a
                            href={project.link}
                            className="inline-block px-4 py-2 bg-green-700 hover:bg-green-600 text-white font-semibold rounded-full transition duration-300"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Access Log &gt;
                        </a>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default ProjectsSection;