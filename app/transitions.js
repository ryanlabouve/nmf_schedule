var dayMappings = {
  'thursday': 0,
  'friday': 1,
  'saturday': 2
};


function dayIsLessThan(day1, day2){
  //console.log('traying dayIsLessThan', day1, day2);
  return dayMappings[day1.id] > dayMappings[day2.id];
}

export default function() {
  this.transition(
    this.fromRoute('day'),
    this.toRoute('day'),
    this.use('to-left'),
    this.toModel(function(newDay, oldDay) {
      return dayIsLessThan(newDay, oldDay);
    }),
    this.reverse('to-right')
  );

  this.transition(
    this.fromRoute('index'),
    this.toRoute('day'),
    this.use('to-left'),
    this.reverse('to-right')
  );

  this.transition(
    this.fromRoute('day.index'),
    this.toRoute('day.event'),
    this.use('explode', {
      matchBy: 'data-event-id',
      use: 'fly-to'
    }, {
      use: 'to-up'
    }),
    this.reverse('explode', {
      matchBy: 'data-event-id',
      use: 'fly-to'
    }, {
      use: 'to-down'
    })
  );

  //this.transition(
    //this.childOf('ol.no-bullets'),
    //this.use('explode', {
      //matchBy: 'data-event-row-id',      // matchBy will look for the same
                                     //// HTML attribute value in both
                                     //// the old and new elements, and
                                     //// for each matching pair, it
                                     //// runs the given transition.

      //// fly-to is a built in transition that animate the element
      //// moving from the position of oldElement to the position of
      //// newElement.
      //use: ['fly-to', { duration: 350 }]
    //},{
      //pickOld: '.event-row',
      //use: ['fade', { duration: 350 }]
    //},
    //{
      //pickNew: '.event-row',
      //use: ['fade', { duration: 350 }]
    //}),
    //this.debug(true)
  //);
}
