const navLinks = {
  middle: [
    {
      id: 2,
      label: "Our Work",
      url: "/ourwork/ourchapters",
      dialog: [
        { id: 1, title: "Our Chapters", path: "/ourwork/ourchapters" },
        { id: 2, title: "Gallery", path: "/ourwork/gallery" },
        { id: 3, title: "Past Events", path: "/ourwork/events" },
        { id: 4, title: "Upcoming Events", path: "/ourwork/upcomingevents" },
      ],
    },
    {
      id: 3,
      label: "Join Us",
      url: "/joinus/volunteering",
      dialog: [
        { id: 1, title: "Volunteering", path: "/joinus/volunteering" },
        { id: 2, title: "Internship", path: "/joinus/internship" },
        { id: 3, title: "Blogs", path: "/joinus/blogs" },
      ],
    },
    {
      id: 1,
      label: "About Us",
      url: "/aboutus",
      dialog: [
        { id: 1, title: "Who We Are", path: "/aboutus#who-we-are" },
        { id: 2, title: "What Do We Do", path: "/aboutus#what-we-do" },
        { id: 3, title: "Meet Our Team", path: "/aboutus#meet-our-team" },
      ],
    },
    {
      id: 4,
      label: "Contact Us",
      url: "/contactus",
      dialog: [
        { id: 1, title: "Map Location", path: "/contactus/map" },
        { id: 2, title: "FAQs", path: "/contactus/faqss" },
      ],
    },
  ],
  right: [],
};

export default navLinks;