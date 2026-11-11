/// reference types="cypress" />

let token
beforeEach(() => {
    cy.GeracaoToken('admin@bibilioteca.com', 'admin123').then((tkn) => {
        token = tkn
    })
});

describe('GET - Testes de API - Gestão de Usuários'), () => {

    it('Deve listar usuários com sucesso', () => {
        cy.api({
            method: 'GET',
            url: 'users',
            headers: { 'Authorization': token }
        }).should(response => {
            expect(response.status).to.eq(200)
            expect(response.body.users).to.be.an("array")
        })
    });
    it('Deve validar proriedades de um usuário', () => {
        cy.api({
            method: 'GET',
            url: 'users',
            headers: { 'Authorization': token }
        }).should(response => {
            expect(response.status).to.eq(200)
            expect(response.body.users[0]).to.have.property("id")
            expect(response.body.users[0]).to.have.property("name")
            expect(response.body.users[0]).to.have.property("email")


        })
    });
    it('Deve listar um usuário via ID com sucesso', () => {
        cy.api({
            method: 'GET',
            url: 'users/2',
            headers: { 'Authorization': token }
        }).should(response => {
            expect(response.status).to.eq(200)
            expect(response.body).to.have.property("id")
            expect(response.body).to.have.property("name")
            expect(response.body).to.have.property("email")
        })
    });
    it('Deve listar usuário com sucesso usando filtro - parâmetros'), () => {
        cy.api({
            method: 'GET',
            url: 'users',
            headers: { 'Authorization': token },
            qs: {
                page: 1,
                limit: 20,
                search: 'usuário'

            }
        }).should(response => {
            expect(response.status).to.eq(200)
        })
    };
}

describe('POST - Testes de API - Gestão de Usuários'), () => {
    it('Deve cadastrar um usuário com sucesso', () => {
        let email = `maria${Date.now()}@email.com`
        cy.api({
            method: 'POST',
            url: 'users',
            body: {
                "name": "Maria Santos",
                "email": email,
                "password": "senha123"
            }

        }).should(response => {
            expect(response.status).to.eq(201)
            expect(response.body.message).to.eq("Usuário criado com sucesso.")
        })
    })

    it('Deve validar um usuário cadastrado com email inválido', () => {
        cy.api({
            method: 'POST',
            url: 'users',
            body: {
                "name": "Maria Santos",
                "email": "mariaemail.com",
                "password": "senha123"
            },
            failOnStatusCode: false
        }).should(response => {
            expect(response.status).to.eq(201)
            expect(response.body.message).to.eq("Formato de email inválido.")

        })
    })

    describe('PUT - Testes de API - Gestão de Usuários'), () => {

        it('Deve atualizar um usuário com sucesso', () => {
            cy.api({
                method: 'PUT',
                url: 'users/10',
                headers: { 'Authorization': token },
                body: {
                    name: "Maria Santos Novo",
                    email: "maria.santos.novo@email.com",
                    password: "NovaSenha123"
                }
            }).should(response => {
                expect(response.status).to.eq(200)
                expect(response.body.message).to.eq("Usuário atualizado com sucesso.")
            })
        })

        it('Deve atualizar um usuário com sucesso de forma dinâmica', () => {
            let email = `fabio${Date.now()}@email.com`
            cy.cadastrarUsuario('Fabio Passos', email, 'senha123').then(userID => { })
            cy.api({
                method: 'PUT',
                url: 'users/' + userID,
                headers: { 'Authorization': token },
                body: {
                    name: "Fabio Passos Novo",
                    email: email,
                    password: "NovaSenha123"
                }
            }).should(response => {
                expect(response.status).to.eq(200)
                expect(response.body.message).to.eq("Usuário atualizado com sucesso.")
            })
        })

        describe('DELETE - Testes de API - Gestão de Usuários'), () => { }

        it('deve excluir um usuário com sucesso', () => {
            cy.api({
                method: 'DELETE',
                url: 'users/32',
                headers: { 'Authorization': token }
            }).should(response => {
                expect(response.status).to.eq(200)
                expect(response.body.message).to.eq("Usuário removido com sucesso.")
            })
            it('deve excluir um usuário de forma dinâmica', () => {
                cy.cadastrarUsuario('Usuário para deletar', 'deletar@email.com', 'senha123').then(userID => {
                    cy.api({
                        method: 'DELETE',
                        url: `users/${userID}`,
                        headers: { 'Authorization': token }
                    }).should(response => {
                        expect(response.status).to.eq(200)
                        expect(response.body.message).to.eq("Usuário removido com sucesso.")
                    })
                })
            })
        })
    }
}
