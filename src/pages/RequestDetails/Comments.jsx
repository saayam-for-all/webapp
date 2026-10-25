import avatar from "../../assets/avatar.jpg";
import React from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";

const Comments = ({ name, message, date, onEdit, onDelete }) => {
  return (
    <section className="bg-white p-4 mb-3 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <img className="mr-2 w-8 h-8 rounded-full" src={avatar} alt={name} />
          <p className="text-sm text-gray-900 font-semibold">{name}</p>
        </div>
        <p className="text-sm text-gray-600">{date}</p>
      </div>
      <div className="mt-2">
        <p className="text-gray-700">{message}</p>
      </div>
      <div className="flex justify-end mt-2 gap-1">
        <IconButton size="small" onClick={onEdit} aria-label="edit comment">
          <EditIcon
            fontSize="small"
            className="text-blue-500 hover:text-blue-600"
          />
        </IconButton>
        <IconButton size="small" onClick={onDelete} aria-label="delete comment">
          <DeleteIcon
            fontSize="small"
            className="text-red-500 hover:text-red-600"
          />
        </IconButton>
      </div>
    </section>
  );
};

export default Comments;
