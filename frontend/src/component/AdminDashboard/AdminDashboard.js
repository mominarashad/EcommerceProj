import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './AdminNavbar';  // Adjust the path if necessary
import Sidebar from './SlidingBar';  // Adjust the path if necessary
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell,
  LineChart, Line, CartesianGrid,
} from 'recharts';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalEarnings: 0,
    totalPurchases: 0,
    completedOrders: 0,
    cancelledOrders: 0,
  });
  const [feedback, setFeedback] = useState([]);
  const COLORS = ['purple', 'green', 'red'];

  useEffect(() => {
    fetchStats();
    fetchFeedback();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/earnings');
      setStats(res.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const fetchFeedback = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/feedback');
      setFeedback(res.data);
    } catch (err) {
      console.error('Error fetching feedback:', err);
    }
  };

  return (
    <div className="admin-dashboard">
      <Navbar />
      <div className="dashboard-layout">
        <Sidebar />
        <div className="dashboard-content">
          <h1>Admin Dashboard</h1>

          <div className="dashboard-cards">
            <div className="cardss">
              <h3>Number of Orders</h3>
              <p>{stats.totalOrders}</p>
            </div>
            <div className="cardss">
              <h3>Total Purchases</h3>
              <p>${stats.totalPurchases}</p>
            </div>
            <div className="cardss">
              <h3>Total Cost</h3>
              <p>${stats.totalEarnings}</p>
            </div>
            <div className="cardss">
              <h3>Completed Orders</h3>
              <p>{stats.completedOrders}</p>
            </div>
            <div className="cardss">
              <h3>Cancelled Orders</h3>
              <p>{stats.cancelledOrders}</p>
            </div>
          </div>

          <div className="dashboard-charts">
            <div className="cardss">
              <h3>Monthly Earnings</h3>
              <BarChart width={300} height={200} data={[{ name: 'Earnings', value: stats.totalEarnings }]}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </div>
            <div className="cardss">
              <h3>Income Distribution</h3>
              <PieChart width={300} height={200}>
                <Pie
                  dataKey="value"
                  data={[
                    { name: 'Earnings', value: stats.totalEarnings },
                    { name: 'Purchases', value: stats.totalPurchases },
                  ]}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  <Cell fill="blue" />
                  <Cell fill="orange" />
                </Pie>
              </PieChart>
            </div>
            <div className="cardss">
              <h3>Orders Status</h3>
              <PieChart width={300} height={200}>
                <Pie
                  dataKey="value"
                  data={[
                    { name: 'Pending', value: stats.totalOrders - stats.completedOrders - stats.cancelledOrders },
                    { name: 'Completed', value: stats.completedOrders },
                    { name: 'Cancelled', value: stats.cancelledOrders },
                  ]}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {COLORS.map((color, index) => (
                    <Cell key={`cell-${index}`} fill={color} />
                  ))}
                </Pie>
              </PieChart>
            </div>
            <div className="cardss">
              <h3>Feedback</h3>
              <LineChart width={300} height={200} data={feedback}>
                <XAxis dataKey="name" />
                <YAxis />
                <CartesianGrid stroke="#ccc" />
                <Line type="monotone" dataKey="value" stroke="#8884d8" />
              </LineChart>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
