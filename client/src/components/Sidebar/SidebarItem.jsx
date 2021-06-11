import React, { useState } from 'react'

function SidebarItem({ icon, text, hoverIcon }) {
    const [img, setImg] = useState(icon);
    return (
        <div className="sidebarItem">
            <img
                src={img}
                onMouseEnter={() => (setImg(hoverIcon))}
                onMouseOut={() => (setImg(icon))}
                alt=""
            />
            <p>{text}</p>
        </div>
    )
}

export default SidebarItem
