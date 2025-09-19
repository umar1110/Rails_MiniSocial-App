Rails.application.routes.draw do

  # Api Routes
  namespace :api do
    namespace :v1 do
      resources :users, only: [:index, :show, :create, :update, :destroy]
      namespace :auth do
        resources :sessions, only: [:index]
      end
    end
  end

  # Devise Routes
  devise_for :users
  # Pages Routes
  get "pages/home"
  # Users Routes
  get "profile/:id", to: "users#show", as: :user # as users means users_path(user)
  # Communities Routes
  resources :communities, only: [:new, :create, :show, :index] do
    member do
      get :join
      post :join, action: :join_post
      post :create_post, action: :create_post
    end
  end
  # Posts Routes
  resources :posts, only: [:index, :show, :new, :create, :edit, :update, :destroy ] do
    resources :likes, only: [:create, :destroy]
    resources :comments, only: [:create, :edit, :update, :destroy]
  end

  mount ActionCable.server => '/cable'
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker

  # Defines the root path route ("/")
  root "pages#home"
end
