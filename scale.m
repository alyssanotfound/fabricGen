clc; clear all; close all;

srcFiles = dir('wallpapers/*.jpg');

for i = 1:length(srcFiles)
    fn = strcat('wallpapers/',srcFiles(i).name);
    A = imread(fn);
    B = imresize(A, 0.3);
    imwrite(B, srcFiles(i).name);
end 