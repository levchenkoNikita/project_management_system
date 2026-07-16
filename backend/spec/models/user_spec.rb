RSpec.describe User, type: :model to
    describe 'validations' do
        it 'is valid with full correct attributes' do
            user = build(:user)
            expect(user).to be_valid
        end

        it 'is not valid with incorrect one attribute' do
            user = build(:user, name: nil)
            expect(user).not_to be_valid
            expect(user).to include("can't be blank")
        end

    end
end