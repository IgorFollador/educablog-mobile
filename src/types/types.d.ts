declare global {
    // Definindo a tipagem para a navegação
    type RootStackParamList = {
      HomePage: undefined;    
      SignInPage: undefined;    
      AdminPage: undefined;    
      PostPage: { postId: string | undefined };
      CreateUserPage: undefined;
      ViewPostPage: { id: string };
    };
  }
  
  export {};
  