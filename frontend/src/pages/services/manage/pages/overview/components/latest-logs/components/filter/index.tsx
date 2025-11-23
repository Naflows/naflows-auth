import { useEffect, useState } from "react";
import type { Filters } from "../..";
import getSvgPerType from "../../methods/getSvg";
import axios from "axios";


const FilterLogs = ({
    filters, setFilters
}: {
    filters: Filters
    setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}) => {
    // Component code here
    const [username, setUsername] = useState<string>("");
    const [userSuggestions, setUserSuggestions] = useState<{
        id: string;
        username: string;
        first_name: string;
        last_name: string;
        profile_picture: string | null;
    }[]>([]);

    useEffect(() => {
        if (username.length > 3 && username !== filters.user) {
            async function fetchUsers(){
                axios.get(`${process.env.DUMMY_API_URL_DEV}/public/user/${username}`, {
                    withCredentials: false,
                }).then((response) => {
                    console.log("Fetched users for username filter:", response.data);
                    setUserSuggestions(response.data.users);
                }).catch((error) => {
                    console.error("Error fetching users for username filter:", error);
                });
            }
            fetchUsers();
        }
    }, [username]);

    return (
        <div className="filter__box">
            <h4>
                Log Filters
            </h4>
            <div className="filters__container">
                <div className="filter--row">
                    <div className="filter">
                        <label htmlFor="date-from">Date From</label>
                        <input
                            type="date"
                            id="date-from"
                            value={filters.dateFrom ? new Date(filters.dateFrom).toISOString().split('T')[0] : ''}
                            onChange={(e) => {
                                const date = e.target.value ? new Date(e.target.value).getTime() : null;
                                setFilters(prev => ({ ...prev, dateFrom: date }));
                            }}
                        />
                    </div>
                    <div className="filter">
                        <label htmlFor="date-to">Date To</label>
                        <input
                            type="date"
                            id="date-to"
                            value={filters.dateTo ? new Date(filters.dateTo).toISOString().split('T')[0] : ''}
                            onChange={(e) => {
                                const date = e.target.value ? new Date(e.target.value).getTime() : null;
                                setFilters(prev => ({ ...prev, dateTo: date }));
                            }}
                        />
                    </div>
                </div>

                <div className="filter--row">
                    <div className="filter">
                        <label htmlFor="type">Type</label>
                        <select 
                            id="type"
                            value={filters.type || ''}
                            onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value || null }))}
                        >
                            <option value="">All</option>
                            <option value="user">
                                User
                            </option>
                            <option value="system">
                                System
                            </option>
                            <option value="Service">
                                Service
                            </option>
                            <option value="security">
                                Security
                            </option>
                            <option value="developers">
                                Developers
                            </option>
                            <option value="settings">
                                Settings
                            </option>
                            <option value="others">
                                Others
                            </option>
                        </select>
                    </div>
                    <div className="filter">
                        <label htmlFor="level">Level</label>
                        <select 
                            id="level"
                            value={filters.level || ''}
                            onChange={(e) => setFilters(prev => ({ ...prev, level: e.target.value || null }))}
                        >
                            <option value="">All</option>
                            <option value="ERROR">Error</option>
                            <option value="WARNING">Warning</option>
                            <option value="INFO">Info</option>
                        </select>
                    </div>
                    <div className="filter">
                        <label htmlFor="user">Username</label>
                        <input
                            type="text"
                            id="user"
                            defaultValue={filters.user || ''}
                            onChange={(e) => {
                                setUsername(e.target.value);
                            }}
                        />

                        {
                            userSuggestions.length > 0 && (
                                <div className="user-suggestions">
                                    {userSuggestions.map((user) => (
                                        <div 
                                            key={user.id} 
                                            className="user-suggestion-item"
                                            onClick={() => {
                                                setFilters(prev => ({ ...prev, user: user.username }));
                                                setUserSuggestions([]);
                                                setUsername(user.username);
                                            }}
                                        >
                                            <img 
                                                src={user.profile_picture || "/default-profile.png"} 
                                                alt={user.username} 
                                                className="user-suggestion-avatar" 
                                            />
                                            <span className="user-suggestion-username">{user.username}</span>
                                        </div>
                                    ))}
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}


export default FilterLogs;