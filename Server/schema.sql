create table if not exists `User`
(
    UserID         uuid     default uuid_v7()           not null
        primary key,
    Username       varchar(25)                          not null,
    Password       char(60)                             not null,
    WishlistPublic bit      default b'0'                not null,
    CreatedAt      datetime default current_timestamp() not null,
    constraint User_pk_2
        unique (Username)
);

create table if not exists `Wishlist`
(
    UserID           uuid                                 not null,
    CheapsharkGameID int                                  not null,
    DateAdded        datetime default current_timestamp() null,
    primary key (UserID, CheapsharkGameID),
    constraint Wishlist_User_UserID_fk
        foreign key (UserID) references User (UserID)
            on update restrict on delete cascade
);

create function if not exists UsernameToUserID(in inp_user varchar(25)) returns UUID return (select UserID from User where Username = inp_user);