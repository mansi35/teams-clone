import React, { useState } from 'react'

function SidebarItem({ icon, text, hoverIcon }) {
    const [img, setImg] = useState(icon);

    const setActive = () => {
        const navs = document.getElementsByClassName('sidebarItem');
        for(var i = 0; i < navs.length; i++) {
            navs[i].classList.remove('active');
        }
        document.getElementById(`${text}`).classList.add('active')
    }

    return (
        <div id={text} className="sidebarItem" onClick={setActive}>
            <img
                src={img}
                alt=""
                onMouseOver={() => (setImg(hoverIcon))}
                onMouseOut={() => (setImg(icon))}
            />
            <p>{text}</p>
        </div>
    )
}

export default SidebarItem
