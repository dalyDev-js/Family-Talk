import EventCard from "@/components/EventCard";
import ExpoloreBtn from "@/components/ExpoloreBtn";
import { events } from "@/lib/constants";

const Home = () => {
  return (
    <section>
      <h1 className="text-center">
        The FamTalk Hub for Every One <br /> You Can't Miss
      </h1>
      <p className="text-center mt-5">Talk. Heal. Reconnect.</p>
      <ExpoloreBtn />

      <div className="mt-20 space-y-7">
        <h3>Featured Events</h3>
        <ul className="events">
          {events.map((event) => (
            <li key={event.title}>
              <EventCard {...event} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Home;
