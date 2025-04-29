function unscrambleMaddr(item, index){
	item.setAttribute("href", "mailto:" + item.getAttribute("addrmask").replace("😅","@").replaceAll("🙃","."))
	item.removeAttribute("addrmask")
	item.innerText = item.innerText.replaceAll("{IGNORETHISPART} a t ","@")
}
maddrs=document.getElementsByClassName("maddr")
Array.prototype.forEach.call(maddrs,unscrambleMaddr)
