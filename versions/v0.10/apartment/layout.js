/**
 * London flat — version 0.1 architectural tracing.
 * Coordinate pairs are pixels in a 1515 × 992 working view of the supplied plan.
 * This is a provisional tracing of an estate agent's drawing, not a survey.
 * Keep these coordinates editable; DO NOT silently promote estimates to measured facts.
 */
export const PLAN = {
  title: 'Clephane Road — first architectural trace',
  grossInternalAreaM2: 52.58, // printed on the source floor plan, including internal walls
  balconyAreaM2: 5.11,      // source's larger balcony; not modelled yet
  pxPerMetre: 85.05,        // calibrated to printed kitchen/reception widths; approximate
  centre: [654, 447],
  ceilingHeight: 2.10,      // virtual ceiling lowered another 10 cm from v0.9 (original remembered 2.30 m)
  wallOuter: 0.19,          // provisional wall construction thicknesses
  wallInner: 0.11,
  spawn: [568, 632],
  // Floorplate outline follows the main dwelling and ENTRANCE RECESS, excluding balconies.
  outline: [
    [179,145], [1141,411], [1141,659], [605,659], [605,700],
    [495,700], [495,756], [250,756], [250,460], [179,460]
  ],
  rooms: [
    { id:'reception', name:'Reception room', subtitle:'5.23 × 3.65 m (plan)', finish:'wood',
      points:[[179,146],[625,268],[625,567],[500,567],[250,567],[250,460],[179,460]], label:[410,389] },
    { id:'kitchen', name:'Kitchen', subtitle:'2.89 × 2.10 m (plan)', finish:'tile',
      points:[[250,568],[495,568],[495,756],[250,756]], label:[371,661] },
    { id:'bathroom', name:'Bathroom', subtitle:'dimensions provisional', finish:'bath',
      points:[[633,320],[701,290],[774,310],[774,569],[633,569]], label:[706,440] },
    { id:'bedroom', name:'Bedroom', subtitle:'4.46 × 3.60 m (plan)', finish:'carpet',
      points:[[778,310],[1141,411],[1141,659],[778,659]], label:[955,499] },
    { id:'hall', name:'Hall / entrance', subtitle:'dimensions provisional', finish:'wood',
      points:[[501,569],[685,569],[685,575],[778,575],[778,660],[605,660],[605,699],[536,699],[536,662],[501,662]],
      label:[665,616] }
  ],
  // Solid walls are uninterrupted line segments. The gaps below are actual door/window openings.
  walls: [
    // Outer perimeter: angled north wall, bedroom far end, southern outline and kitchen return.
    { a:[179,145], b:[1141,411], kind:'outer' },
    { a:[1141,411],b:[1141,458],kind:'outer' },
    { a:[1141,581],b:[1141,659],kind:'outer' },
    { a:[1141,659],b:[605,659],kind:'outer' },
    { a:[605,659],b:[605,700],kind:'outer' },
    { a:[495,700],b:[495,756],kind:'outer' },
    { a:[495,756],b:[250,756],kind:'outer' },
    { a:[250,756],b:[250,460],kind:'outer' },
    { a:[250,460],b:[179,460],kind:'outer' },
    // Between kitchen, reception and entrance hallway.
    { a:[250,568],b:[310,568],kind:'inner' },
    { a:[436,568],b:[510,568],kind:'inner' },
    { a:[615,568],b:[630,568],kind:'inner' },
    { a:[495,568],b:[495,700],kind:'inner' },
    { a:[495,662],b:[536,662],kind:'inner' },
    { a:[536,662],b:[536,700],kind:'inner' },
    // Bathroom walls; 685..744 is the bathroom door opening.
    { a:[629,268],b:[629,569],kind:'inner' },
    { a:[629,569],b:[685,569],kind:'inner' },
    { a:[745,569],b:[778,569],kind:'inner' },
    // Bedroom west wall, with a door opening into the hall.
    { a:[778,310],b:[778,576],kind:'inner' },
    { a:[778,652],b:[778,659],kind:'inner' }
  ],
  glazing: [
    // Full-height glazed wall to reception balcony. The balcony itself is not yet modelled.
    { a:[179,145],b:[179,460],name:'Reception balcony glazing', mullions:[0.50,0.74] },
    // Full-height French doors / glazing to the small bedroom balcony.
    { a:[1141,458],b:[1141,581],name:'Bedroom balcony glazing', mullions:[0.50] }
  ],
  doors: [
    // Doors are visual placeholders set open, except the front door which remains closed.
    { id:'front', name:'Front door', a:[536,700],b:[605,700],open:false },
    { id:'living-left',name:'Reception double door', a:[510,568],b:[562,568], open:true, swing:-1.07 },
    { id:'living-right',name:'Reception double door', a:[615,568],b:[563,568], open:true, swing:1.07 },
    { id:'bath',name:'Bathroom door', a:[745,569],b:[685,569],open:true,swing:1.45 },
    { id:'bed',name:'Bedroom door',a:[778,652],b:[778,576],open:true,swing:1.12 }
  ],
  referenceNotes: 'Source plan shows irregular angled upper wall, 52.58 m² GIA, reception and bedroom balcony exits. Model ceiling now 2.10 m at user request (previous virtual 2.20 m); wall thicknesses, framing and door swings remain provisional.'
};
