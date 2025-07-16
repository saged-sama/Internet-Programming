import { useState } from "react";

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState<"history" | "mission">("history");

  const handleTabChange = (tab: "history" | "mission") => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div 
        className="relative h-64 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80')"
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
          <h1 className="text-4xl font-bold mb-4">
            {activeTab === "history" ? "History of the Department" : "Mission & Vision"}
          </h1>
          <nav className="flex items-center space-x-2 text-sm">
            <span>🏠 Home</span>
            <span>•</span>
            <span className="text-blue-300">
              {activeTab === "history" ? "History" : "Mission Vision"}
            </span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto py-8 px-4">
        <div className="flex">
          {/* Main Content */}
          <div className="flex-1 mr-8">
            {activeTab === "history" ? (
              <div className="prose max-w-none">
                <p className="text-justify mb-6">
                  The journey of the Department of Computer Science and Engineering started in a bright morning of September 1992. 
                  It was a brainchild of Dr. M. Lutfor Rahman, a visionary Professor of the Department of Applied Physics and 
                  Electronics, University of Dhaka, who felt the urge to come up with an academic department to tackle the 
                  snowballing necessity for computer scientists and IT specialists. In spite of a humble beginning, the department, 
                  then known as Department of Computer Science, attracted the very best minds of the nation and soon 
                  accumulated a star studded faculty roster as well as the brightest of the students.
                </p>

                <p className="text-justify mb-6">
                  The department started with a single classroom offering M.Sc. degree in Computer Science under the Faculty of 
                  Science. In 1994, three year B.Sc. Honors program was introduced which was upgraded to four year B.Sc. Honors 
                  program in 1997. It is the first department in the Faculty of Science to introduce the four year B.Sc. program in the 
                  University of Dhaka. In 2004, the name of the department was changed to Computer Science and Engineering, 
                  leading to its inclusion in the freshly formed Faculty of Engineering and Technology in 2008. In 2010, the four point 
                  grading system was introduced in the Faculty of Engineering and Technology.
                </p>

                <p className="text-justify mb-6">
                  Initially, the department started with 20 students in the M.Sc. program in 1992 and then started B.Sc. (Hons) program 
                  from 1995 with 21 students. With the increasing demand of Computer Science graduates for the nation, University of 
                  Dhaka increased the number of seats for B.Sc. (Hons) program to 60 in 1995. So far, 25 batches have completed 
                  their undergraduate studies and 5 batches are currently pursuing their degrees from the department. In addition, 31 
                  batches have completed the graduate study (MSc/ MS) programs and currently 1 batch is continuing their MS 
                  coursework/ research. Although only 11 researchers completed PhD from this department, currently there are 4 PhD 
                  students pursuing towards their degrees in addition to 1 MPhil students.
                </p>

                <p className="text-justify mb-6">
                  In total, the department has 39 active teachers, 19 of whom have already earned their PhD degrees. Currently,14 
                  faculty members are on leave for pursuing their PhDs from different universities of the world.
                </p>

                <p className="text-justify mb-6">
                  A summary of the faculty members are listed in the following table:
                </p>

                <div className="overflow-x-auto mb-6">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-4 py-2 text-left">Position</th>
                        <th className="border border-gray-300 px-4 py-2 text-center">In Total</th>
                        <th className="border border-gray-300 px-4 py-2 text-center">In Service</th>
                        <th className="border border-gray-300 px-4 py-2 text-center">On Study Leave</th>
                        <th className="border border-gray-300 px-4 py-2 text-center">On Leave</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">Professor</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">14</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">13</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">0</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">1</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">Associate Professor</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">6</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">5</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">0</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">1</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">Assistant Professor</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">6</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">3</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">2</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">1</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">Lecturer</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">13</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">3</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">10</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">0</td>
                      </tr>
                      <tr className="bg-gray-100 font-bold">
                        <td className="border border-gray-300 px-4 py-2">Total</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">39</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">24</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">12</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">3</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <p className="text-justify mb-6">
                  Currently, Professor Dr. Md. Abdur Razzaque is working as the 12th chairperson of the department and leading the 
                  progress of the department after successful completion of 11 ancestors:
                </p>

                <div className="mb-6">
                  <h3 className="font-bold text-lg mb-4">Dept. of Computer Science</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 px-4 py-2 text-left">Name of the Chairperson</th>
                          <th className="border border-gray-300 px-4 py-2 text-center">Starting Date</th>
                          <th className="border border-gray-300 px-4 py-2 text-center">Ending Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2">1. Prof. Dr. M. Lutfor Rahman</td>
                          <td className="border border-gray-300 px-4 py-2 text-center">01-09-1992</td>
                          <td className="border border-gray-300 px-4 py-2 text-center">31-08-1995</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2">2. Prof. Dr. Md. Abdul Mottalib</td>
                          <td className="border border-gray-300 px-4 py-2 text-center">01-09-1995</td>
                          <td className="border border-gray-300 px-4 py-2 text-center">31-08-1998</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2">3. Dr. Md. Alamgir Hossain</td>
                          <td className="border border-gray-300 px-4 py-2 text-center">01-09-1998</td>
                          <td className="border border-gray-300 px-4 py-2 text-center">30-09-2000</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2">4. Md. Razaul Karim</td>
                          <td className="border border-gray-300 px-4 py-2 text-center">01-10-2000</td>
                          <td className="border border-gray-300 px-4 py-2 text-center">10-02-2003</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2">5. Dr. Hafiz Md. Hasan Babu</td>
                          <td className="border border-gray-300 px-4 py-2 text-center">19-02-2003</td>
                          <td className="border border-gray-300 px-4 py-2 text-center">-</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-bold text-lg mb-4">Dept. of Computer Science and Engineering</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <tbody>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2">6. Dr. Hafiz Md. Hasan Babu</td>
                          <td className="border border-gray-300 px-4 py-2 text-center">-</td>
                          <td className="border border-gray-300 px-4 py-2 text-center">18-02-2006</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2">6. Dr. Md. Haider Ali</td>
                          <td className="border border-gray-300 px-4 py-2 text-center">19-02-2006</td>
                          <td className="border border-gray-300 px-4 py-2 text-center">18-02-2009</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2">7. Prof. Dr. Surolya Pervin</td>
                          <td className="border border-gray-300 px-4 py-2 text-center">19-02-2009</td>
                          <td className="border border-gray-300 px-4 py-2 text-center">18-02-2012</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2">8. Dr. Md. Hasanuzzaman</td>
                          <td className="border border-gray-300 px-4 py-2 text-center">19-02-2012</td>
                          <td className="border border-gray-300 px-4 py-2 text-center">18-02-2015</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2">9. Prof. Dr. Shabbir Ahmed</td>
                          <td className="border border-gray-300 px-4 py-2 text-center">19-02-2015</td>
                          <td className="border border-gray-300 px-4 py-2 text-center">18-02-2018</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2">10. Prof. Dr. Md. Mustafizur Rahman</td>
                          <td className="border border-gray-300 px-4 py-2 text-center">19-02-2018</td>
                          <td className="border border-gray-300 px-4 py-2 text-center">18-02-2021</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2">11. Prof. Dr. Saifuddin Md Tareeq</td>
                          <td className="border border-gray-300 px-4 py-2 text-center">19-02-2021</td>
                          <td className="border border-gray-300 px-4 py-2 text-center">18-02-2024</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2">12. Prof. Dr. Md. Abdur Razzaque</td>
                          <td className="border border-gray-300 px-4 py-2 text-center">19-02-2024</td>
                          <td className="border border-gray-300 px-4 py-2 text-center">To date</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <p className="text-justify mb-6">
                  Further, there are 15 dedicated officers and staffs who are working graciously in order to maintain smooth 
                  functioning of the administrative, technical and daily support activities of the department.
                </p>

                <p className="text-justify">
                  From its very inception, the Department of Computer Science and Engineering has been a symbol of endurance and 
                  excellence in both education as well as administrative sector. The department's pioneering stride towards better 
                  education and standard operational procedures have been spearheaded by the faculties, staffs and students of 
                  similar mentality. Today, CSEDU is deemed as one of the leading academic departments in the country fostering 
                  quality education, cutting-edge research and development industrial collaboration and student engagement in 
                  complex problem solving.
                </p>
              </div>
            ) : (
              <div className="prose max-w-none">
                <p className="text-justify mb-6">
                  The Department of Computer Science and Engineering has been one of the pioneering organizations in the 
                  education sector of Bangladesh since its inception in 1992. The department is keen on pushing the boundaries of 
                  traditional education system and vigilant to face the challenges that the ever changing field of research brings 
                  forth. It is the optimum combination of knowledge generation and application that makes the distinctive feature of 
                  the department.
                </p>

                <p className="text-justify mb-6">
                  The department focuses on four major perceptions:
                </p>

                <div className="mb-6">
                  <h3 className="font-bold text-lg mb-4">Excellence in Education.</h3>
                  <p className="text-justify mb-4">
                    From the very beginning, the department is dedicated to provide the best education in the 
                    field of Computer Science and Engineering. Armed with a group of experienced faculty and the brightest of 
                    students, the department has made exemplary improvement in this field of education. The reflection of this effort 
                    can be found amongst the top researchers, programmers, or IT specialists working in top level universities and 
                    companies in Bangladesh and all over the world who graduated from the department.
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="font-bold text-lg mb-4">Reputation through Research.</h3>
                  <p className="text-justify mb-4">
                    The department focuses heavily on the quality and impact of the researches done 
                    in the field of Computer Science and Engineering as well as in multidisciplinary researches conducted in the 
                    department. The researches have been focused towards responding to local and global real world crises as well as 
                    crossing the frontiers of traditional methods to create new knowledge.
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="font-bold text-lg mb-4">Steps towards Society.</h3>
                  <p className="text-justify mb-4">
                    The department is always ready to take the responsibility of taking the necessary steps to 
                    deploy ICT in social development. The department is keen to fulfill its social responsibility by taking up projects to 
                    automate institutional processes at the university and national levels, educate and train people, especially the 
                    young people of the country, through workshops on programming, software design, and other ICT training 
                    programs.
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="font-bold text-lg mb-4">Equality for Everyone.</h3>
                  <p className="text-justify mb-4">
                    Everyone in the Department of Computer Science and Engineering is treated and considered 
                    as equal. People's past, gender, financial background, ethnicity, religion are not at all considered in the assessment 
                    of their present performance. This place gives everyone the opportunity to make a name for themselves and stand 
                    out as a member of the CSEDU family. It creates a healthy atmosphere for the students, one which will be remembered by 
                    their department and respected by all.
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="font-bold text-lg mb-4">Conception of Culture.</h3>
                  <p className="text-justify mb-4">
                    The department opens its doors towards diversity. People from all over the country, from 
                    different cultural backgrounds come to the department and become a part of the same culture that is practised in 
                    the department. It's a place for mutual respect and admiration for everyone. This combination of variety ensures an 
                    accessible and tolerant environment in the department. An average of <strong>24.59%</strong> women out of all students have 
                    already pursued degrees from the department which is a reflection of advancement for women in technology in 
                    Bangladesh.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="w-80">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="border-b border-gray-200 pb-4 mb-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <span className="text-blue-500 mr-2">—</span>
                  ABOUT
                </h3>
              </div>
              <nav className="space-y-2">
                <button
                  onClick={() => handleTabChange("history")}
                  className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                    activeTab === "history"
                      ? "bg-blue-50 text-blue-600 border-l-4 border-blue-500"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  History
                </button>
                <button
                  onClick={() => handleTabChange("mission")}
                  className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                    activeTab === "mission"
                      ? "bg-blue-50 text-blue-600 border-l-4 border-blue-500"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Mission & Vision
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}