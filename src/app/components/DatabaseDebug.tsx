import { useState } from "react";
import { getAllUsers, clearDatabase } from "../utils/myDatabase";
import { Button } from "../components/ui/button";
import { Database, Trash2, RefreshCw } from "lucide-react";

export function DatabaseDebug() {
  const [users, setUsers] = useState(getAllUsers());
  const [showDebug, setShowDebug] = useState(false);

  const refreshData = () => {
    setUsers(getAllUsers());
  };

  const handleClearDatabase = () => {
    if (window.confirm("Are you sure you want to clear all database data? This cannot be undone.")) {
      clearDatabase();
      setUsers([]);
      window.location.reload();
    }
  };

  if (!showDebug) {
    return (
      <button
        onClick={() => setShowDebug(true)}
        className="fixed bottom-4 right-4 bg-gray-800 text-white p-3 rounded-full shadow-lg opacity-0 hover:opacity-100 transition-opacity z-50"
        title="View Database"
      >
        <Database className="h-5 w-5" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-xl shadow-2xl p-6 max-w-2xl max-h-[600px] overflow-auto z-50 border-2 border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Database className="h-6 w-6" />
          myDatabase Debug
        </h3>
        <button
          onClick={() => setShowDebug(false)}
          className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
        >
          ×
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        <Button onClick={refreshData} size="sm" variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
        <Button onClick={handleClearDatabase} size="sm" variant="destructive">
          <Trash2 className="h-4 w-4 mr-2" />
          Clear All Data
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="font-semibold mb-2">Total Users: {users.length}</h4>
        </div>

        {users.length === 0 ? (
          <p className="text-gray-500 italic">No users in database</p>
        ) : (
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                  <div>
                    <span className="font-semibold">Username:</span> {user.username}
                  </div>
                  <div>
                    <span className="font-semibold">Email:</span> {user.email}
                  </div>
                  <div>
                    <span className="font-semibold">Password:</span> {user.password}
                  </div>
                  <div>
                    <span className="font-semibold">Created:</span>{" "}
                    {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                </div>
                
                <div className="border-t pt-3 mt-3">
                  <h5 className="font-semibold mb-2">Cart Items: {user.cart.length}</h5>
                  {user.cart.length === 0 ? (
                    <p className="text-gray-500 text-sm italic">Empty cart</p>
                  ) : (
                    <div className="space-y-2">
                      {user.cart.map((item) => (
                        <div key={item.id} className="bg-white rounded p-2 text-sm flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <img src={item.image} alt={item.name} className="h-10 w-10 object-cover rounded" />
                            <div>
                              <div className="font-medium">{item.name}</div>
                              <div className="text-gray-500">{item.category}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">₱{item.price}</div>
                            <div className="text-gray-500">Qty: {item.quantity}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
