import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [tickets, setTickets] = useState([]);
  const [groupBy, setGroupBy] = useState("status");
  const [sortBy, setSortBy] = useState("priority");

  useEffect(() => {
    fetch("https://api.quicksell.co/v1/internal/frontend-assignment")
      .then((response) => response.json())
      .then((data) => setTickets(data.tickets))
      .catch((error) => console.error("Error:", error));

    const savedGroupBy = localStorage.getItem("groupBy");
    const savedSortBy = localStorage.getItem("sortBy");
    if (savedGroupBy) setGroupBy(savedGroupBy);
    if (savedSortBy) setSortBy(savedSortBy);
  }, []);

  const groupTickets = () => {
    switch (groupBy) {
      case "status":
        return tickets.reduce((acc, ticket) => {
          acc[ticket.status] = acc[ticket.status] || [];
          acc[ticket.status].push(ticket);
          return acc;
        }, {});
      case "user":
        return tickets.reduce((acc, ticket) => {
          acc[ticket.user] = acc[ticket.user] || [];
          acc[ticket.user].push(ticket);
          return acc;
        }, {});
      case "priority":
        return tickets.reduce((acc, ticket) => {
          acc[ticket.priority] = acc[ticket.priority] || [];
          acc[ticket.priority].push(ticket);
          return acc;
        }, {});
      default:
        return {};
    }
  };

  const sortTickets = (groupedTickets) => {
    const sortedTickets = {};
    Object.keys(groupedTickets).forEach((group) => {
      sortedTickets[group] = groupedTickets[group].sort((a, b) => {
        if (sortBy === "priority") {
          return b.priority - a.priority;
        } else if (sortBy === "title") {
          return a.title.localeCompare(b.title);
        }
        return 0;
      });
    });
    return sortedTickets;
  };

  const displayTickets = () => {
    const groupedTickets = groupTickets();
    const sortedTickets = sortTickets(groupedTickets);
    return sortedTickets;
  };

  useEffect(() => {
    localStorage.setItem("groupBy", groupBy);
    localStorage.setItem("sortBy", sortBy);
  }, [groupBy, sortBy]);

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 4:
        return (
          <img
            src={`${process.env.PUBLIC_URL}/icons/SVG - Urgent Priority colour.svg`}
            alt="Urgent Priority"
          />
        );
      case 3:
        return (
          <img
            src={`${process.env.PUBLIC_URL}/icons/Img - High Priority.svg`}
            alt="High Priority"
          />
        );
      case 2:
        return (
          <img
            src={`${process.env.PUBLIC_URL}/icons/Img - Medium Priority.svg`}
            alt="Medium Priority"
          />
        );
      case 1:
        return (
          <img
            src={`${process.env.PUBLIC_URL}/icons/Img - Low Priority.svg`}
            alt="Low Priority"
          />
        );
      case 0:
        return (
          <img
            src={`${process.env.PUBLIC_URL}/icons/No-priority.svg`}
            alt="No Priority"
          />
        );
      default:
        return null;
    }
  };

  const ticketsToDisplay = displayTickets();

  return (
    <div className="kanban-board">
      <header>
        <div className="controls">
          <button onClick={() => setGroupBy("status")}>Group by Status</button>
          <button onClick={() => setGroupBy("user")}>Group by User</button>
          <button onClick={() => setGroupBy("priority")}>
            Group by Priority
          </button>
          <button onClick={() => setSortBy("priority")}>
            Sort by Priority
          </button>
          <button onClick={() => setSortBy("title")}>Sort by Title</button>
        </div>
      </header>

      <div className="columns">
        {Object.keys(ticketsToDisplay).map((group) => (
          <div key={group} className="column">
            <h3>{group}</h3>
            {ticketsToDisplay[group].map((ticket) => (
              <div key={ticket.id} className="card">
                <h4>{ticket.title}</h4>
                {getPriorityIcon(ticket.priority)}
                <p>{ticket.description}</p>
                <p>
                  <strong>Status:</strong> {ticket.status}
                </p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
