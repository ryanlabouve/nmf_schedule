var dayMappings = {
  'thursday': 0,
  'friday': 1,
  'saturday': 2
};


function dayIsLessThan(day1, day2){
  console.log('traying dayIsLessThan', day1, day2);
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
    this.reverse('to-right'),
    this.debug(true)
  );

  this.transition(
    this.fromRoute('index'),
    this.toRoute('day'),
    this.use('to-left'),
    this.reverse('to-right')
  );

  this.transition(
    this.fromRoute('day.index'),
    this.toRoute('day.talk'),
    this.use('explode', {
      matchBy: 'data-photo-id',
      use: 'fly-to'
    }, {
      use: 'to-up'
    }),
    this.reverse('explode', {
      matchBy: 'data-photo-id',
      use: 'fly-to'
    }, {
      use: 'to-down'
    })

  );
}
