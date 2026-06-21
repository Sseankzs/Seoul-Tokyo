/* ============================ CHECKLIST STATE ============================ */
/* Shared "done" state for both itinerary.html and checklist.html.
   Persisted in localStorage (per device/browser), synced live across pages
   and tabs. An item id is `${dayId}#${blockIndex}`, e.g. "kr1#3". */
(function(global){
  const KEY='tripChecklist.v1';
  const EV='checklist:change';

  function load(){
    try{ return new Set(JSON.parse(localStorage.getItem(KEY)||'[]')); }
    catch(e){ return new Set(); }
  }
  function save(set){
    try{ localStorage.setItem(KEY, JSON.stringify([...set])); }catch(e){}
  }
  function fire(){ global.dispatchEvent(new CustomEvent(EV)); }

  const Checklist={
    /** id for a block within a day */
    id(dayId, blockIndex){ return dayId+'#'+blockIndex; },
    /** Set of all done ids */
    all(){ return load(); },
    has(id){ return load().has(id); },
    set(id, on){
      const s=load();
      if(on) s.add(id); else s.delete(id);
      save(s); fire();
    },
    toggle(id){
      const s=load();
      const on=!s.has(id);
      if(on) s.add(id); else s.delete(id);
      save(s); fire();
      return on;
    },
    clear(){ save(new Set()); fire(); },
    /** subscribe to changes (same tab + other tabs/pages) */
    onChange(cb){
      global.addEventListener(EV, cb);
      global.addEventListener('storage', e=>{ if(e.key===KEY) cb(); });
    },
  };
  global.Checklist=Checklist;
})(window);
