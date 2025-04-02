import TeamMember from "../../components/TeamMember";

export default function TeamPage() {
  return (
    <main className="min-h-screen py-16 bg-gradient-to-br from-purple-100 to-pink-100">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">Meet Our Team</h1>
        <h2 className="text-xl text-gray-600 text-center mb-12">The creative minds behind Fitly</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <TeamMember 
            name="SRIJAN"
            role="FRONT-END DEVELOPER"
            quote="GTA Khelne do Plssss...."
            image="/images/Srijan.png"
            instagram="https://www.instagram.com/srijan.0_0/"
            linkedin="https://www.linkedin.com/in/srijansrivastava1202/"
          />
          <TeamMember 
            name="MAHIN"
            role="BACK-END DEVELOPER"
            quote="Sherr........"
            image="/images/Mahin.png"
            instagram="https://www.instagram.com/mahin._.dhoke/"
            linkedin="https://www.linkedin.com/in/mahin-dhoke/"
          />
          <TeamMember 
            name="DEEPANSHU"
            role="MANAGER"
            quote="Aajao Pubg khete hai....."
            image="/images/Deepanshu.png"
            instagram="https://www.instagram.com/realdeepanshuop/"
            linkedin="https://www.linkedin.com/in/deepanshuop/"
          />
          <TeamMember 
            name="SANSKRITI"
            role="DESIGNER"
            quote="Yayyyyyyyyyyyyyy......."
            image="/images/Sanskriti.png"
            instagram="https://www.instagram.com/kritisans25"
            linkedin="https://www.linkedin.com/in/sanskriti-singh-2b0bb72b8"
          />
        </div>
      </div>
    </main>
  );
} 