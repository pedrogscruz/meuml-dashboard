describe('gorillascode.user', function() {

  beforeEach(module('gorillascode.user'));

  describe('LocalUserService', function() {
    var LocalUserService;

    beforeEach(module(function($provide) {
      $provide.service('Users', [function() {}]);
      $provide.service('$cookies', [function() {
        return {
          getObject: function() {
            return null;
          },
          putObject: function() {},
          remove: function() {}
        };
      }]);
    }));

    beforeEach(inject(function($injector) {
      LocalUserService = $injector.get('LocalUserService');
    }));

    it('should user be null without logged', function() {
      expect(LocalUserService.getUser()).toBe(null);
    });

    it('should user be equal logged user', function() {
      var user = { id: 1 };
      LocalUserService.setUser(user);

      expect(LocalUserService.getUser()).toBe(user);
    });

    it('should user be null after cleanUser()', function() {
      var user = { id: 1 };

      LocalUserService.setUser(user);
      LocalUserService.cleanUser();

      expect(LocalUserService.getUser()).toBe(null);
    });
  });
});