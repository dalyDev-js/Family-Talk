export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image: string;
  category: "conference" | "hackathon" | "meetup";
  registrationLink: string;
}

export const events: Event[] = [
  {
    id: "1",
    title: "React Summit 2025",
    description:
      "The biggest React conference worldwide with talks from core team members and industry leaders. Join thousands of developers to learn about the latest in React, Next.js, and the ecosystem.",
    date: "June 13-17, 2025",
    time: "9:00 AM - 6:00 PM CEST",
    location: "Amsterdam, Netherlands",
    image: "/images/event1.png",
    category: "conference",
    registrationLink: "https://reactsummit.com",
  },
  {
    id: "2",
    title: "AWS re:Invent 2025",
    description:
      "Amazon's premier cloud computing conference featuring keynotes, training sessions, and hands-on labs. Learn about the latest AWS services and best practices from experts.",
    date: "November 30 - December 4, 2025",
    time: "8:00 AM - 7:00 PM PST",
    location: "Las Vegas, NV, USA",
    image: "/images/event2.png",
    category: "conference",
    registrationLink: "https://reinvent.awsevents.com",
  },
  {
    id: "3",
    title: "ETHGlobal Hackathon",
    description:
      "36-hour blockchain hackathon bringing together developers to build innovative dApps and Web3 projects. Compete for prizes and connect with the Ethereum community.",
    date: "March 20-22, 2025",
    time: "6:00 PM - 6:00 PM (36 hours)",
    location: "San Francisco, CA, USA",
    image: "/images/event3.png",
    category: "hackathon",
    registrationLink: "https://ethglobal.com",
  },
  {
    id: "4",
    title: "Google I/O 2025",
    description:
      "Google's annual developer conference showcasing the latest in Android, Web, AI, and Cloud technologies. Features keynotes, sessions, and hands-on experiences.",
    date: "May 14-15, 2025",
    time: "10:00 AM - 5:00 PM PDT",
    location: "Mountain View, CA, USA",
    image: "/images/event4.png",
    category: "conference",
    registrationLink: "https://io.google",
  },
  {
    id: "5",
    title: "ViteConf 2025",
    description:
      "Free online conference dedicated to Vite and the projects building on top of it. Learn about modern frontend tooling and performance optimization.",
    date: "October 9-10, 2025",
    time: "12:00 PM - 8:00 PM UTC",
    location: "Virtual Event",
    image: "/images/event5.png",
    category: "conference",
    registrationLink: "https://viteconf.org",
  },
  {
    id: "6",
    title: "MLH Local Hack Day",
    description:
      "Major League Hacking's 12-hour community hackathon for beginners and experienced developers. Build projects, learn new skills, and win prizes from home.",
    date: "April 5, 2025",
    time: "9:00 AM - 9:00 PM (12 hours)",
    location: "Global (Virtual)",
    image: "/images/event6.png",
    category: "hackathon",
    registrationLink: "https://mlh.io/seasons/2025/events",
  },
];
