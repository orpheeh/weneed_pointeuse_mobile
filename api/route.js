

module.exports  = (app) => {
    const control = require('./controller');

    app.route('/pointage')
        .get(control.list_all_pointage)
        .post(control.create_pointage);
    
    app.route('/pointage/:id')
        .put(control.update_pointage)
        .delete(control.delete_pointage)
        .get(control.get_pointage);

    
    app.route('/member')
        .get(control.list_all_member)
        .post(control.create_member);
    
    app.route('/member/:id')
        .put(control.update_member)
        .delete(control.delete_member)
        .get(control.get_member);
    
    app.route('/code')
        .get(control.list_all_code)
        .post(control.create_code);
    
    app.route('/code/:id')
        .put(control.update_code)
        .delete(control.delete_code)
        .get(control.get_code);

    app.route('/mc')
        .get(control.list_all_member_code)
        .post(control.create_member_code);

    app.route('/mc/:id')
        .get(control.get_member_code)
        .put(control.update_member_code)
        .delete(control.delete_member_code);
}