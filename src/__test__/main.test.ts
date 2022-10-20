describe('Main test sample', () => {
	beforeEach(async () => {
		console.log('Before');
	});

	describe('Suite', () => {
		it('Sucess', () => {
			console.log('Test passing');
			expect(true).toBeTruthy();
		});
	});
});
